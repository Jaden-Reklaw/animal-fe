import { Amplify } from 'aws-amplify';
import { type SignInOutput, fetchAuthSession, signIn, signOut } from '@aws-amplify/auth';
import { AuthStack } from '../../../animal-api/outputs.json';

const awsRegion = 'us-east-2';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: AuthStack.AnimalUserPoolId,
            userPoolClientId: AuthStack.AnimalUserPoolClientId,
            identityPoolId: AuthStack.AnimalIdentityPoolId,
        },
    },
});

export class AuthService {

    private user: SignInOutput | undefined;
    private userName: string = '';


    /**
     * Logs in the user with the given username and password. If successful, stores 
     * the user information and username in the service instance.
     * @param userName The username of the user.
     * @param password The password of the user.
     * @returns The user information if login is successful, otherwise undefined.
     */
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
            return this.user;
        } catch (error) {
            console.error(error);
            return undefined
        }
    }

    public async logout() {
        try {
            await signOut();
            this.user = undefined;
            this.userName = '';
        } catch (error) {
            console.error(error);
        }
    }

    public getUserName() {
        return this.userName
    }
}