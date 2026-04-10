import { Amplify } from 'aws-amplify';
import type { SignInOutput } from '@aws-amplify/auth';
import { fetchAuthSession, getCurrentUser, signIn } from '@aws-amplify/auth';
import { AuthStack } from '../../../animal-api/outputs.json';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'us-east-2';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: AuthStack.AnimalUserPoolId,
            userPoolClientId: AuthStack.AnimalUserPoolClientId,
            identityPoolId: AuthStack.AnimalIdentityPoolId
        },
    },
});

export class AuthService {

    private user: object | undefined;
    private userName: string = '';
    public jwtToken: string | undefined;
    private temporaryCredentials: object | undefined;

    public async tryRestoreSession(): Promise<string | undefined> {
        try {
            const currentUser = await getCurrentUser();
            this.userName = currentUser.username;
            await this.generateIdToken();
            this.user = currentUser;
            return this.userName;
        } catch {
            return undefined;
        }
    }

    public isAuthorized() {
        if (this.user) {
            return true;
        }
        return false;
    }


    public async login(userName: string, password: string): Promise<object | undefined> {
        try {
            const signInOutput: SignInOutput = await signIn({
                username: userName,
                password: password,
                options: {
                    authFlowType: 'USER_PASSWORD_AUTH'
                }
            });
            this.user = signInOutput;
            this.userName = userName;
            await this.generateIdToken();
            return this.user;
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    public async getTemporaryCredentials() {
        if (this.temporaryCredentials) {
            return this.temporaryCredentials
        }
        this.temporaryCredentials = await this.generateTempCredentials()
        return this.temporaryCredentials;
    }

    private async generateTempCredentials() {
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.AnimalUserPoolId}`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                clientConfig: {
                    region: awsRegion
                },
                identityPoolId: AuthStack.AnimalIdentityPoolId,
                logins: {
                    [cognitoIdentityPool]: this.jwtToken!
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials
    }

    private async generateIdToken() {
        const session = await fetchAuthSession();
        this.jwtToken = session.tokens?.idToken?.toString();
    }

    public getIdToken() {
        return this.jwtToken;
    }

    public getUserName() {
        return this.userName
    }

    public logout() {
        this.user = undefined;
        this.userName = '';
        this.jwtToken = undefined;
        this.temporaryCredentials = undefined;
        // Note: Amplify does not have a logout function that clears the session, so we just clear the local variables. The session will expire after a certain time and the user will be logged out automatically.
        //clear local storage to clear the session
        localStorage.clear();        
    }
}