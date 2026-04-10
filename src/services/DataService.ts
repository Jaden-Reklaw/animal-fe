import { AuthService } from "./AuthService";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DataStack } from "../../../animal-api/outputs.json";
import type { AnimalEntry } from "../models/animal.model";

const animalApiUrl = 'https://6r2f4eueug.execute-api.us-east-2.amazonaws.com/prod/animals';

export class DataService {

    private authService: AuthService;
    private s3Client: S3Client | undefined;
    private awsRegion = 'us-east-2';

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public reserveSpace(animalId: string = '123') {
        return animalId;
    }

    public async getAnimals(): Promise<AnimalEntry[]> {
        const getAnimalsResult = await fetch(animalApiUrl, {

            method: 'GET',
            headers: {
                'Authorization': this.authService.jwtToken!
            }
        });
        const getAnimalsResultJson = await getAnimalsResult.json();
        return getAnimalsResultJson;
    }


    public async createAnimals(name: string, location: string, photo?: File) {
        console.log('calling create animals!!');
        const animal = {} as AnimalEntry;
        animal.name = name;
        animal.location = location  
        if (photo) {
            const uploadUrl = await this.uploadPublicFile(photo);
            animal.photoUrl = uploadUrl;
        }
        const postResult = await fetch(animalApiUrl, {
            method: 'POST',
            body: JSON.stringify(animal),
            headers: {
                'Authorization': this.authService.jwtToken!
            }
        });
        const postResultJSON = await postResult.json();
        return postResultJSON.id
    }

    private async uploadPublicFile(file: File) {
        const credentials = await this.authService.getTemporaryCredentials();
        console.log('Uploading file to S3 with temporary credentials', credentials);
        if (!this.s3Client) {
            this.s3Client = new S3Client({
                credentials: credentials as any,
                region: this.awsRegion
            });
        }
        console.log('Uploading file to S3 bucket', DataStack.AnimalPhotosBucketName);
        const arrayBuffer = await file.arrayBuffer();
        const command = new PutObjectCommand({
            Bucket: DataStack.AnimalPhotosBucketName,
            Key: file.name,
            ACL: 'public-read',
            Body: new Uint8Array(arrayBuffer)
        });
        await this.s3Client.send(command);
        console.log('File uploaded to S3 bucket', DataStack.AnimalPhotosBucketName, 'with key', file.name);
        return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`
    }

    public isAuthorized() {
        return this.authService.isAuthorized();
    }
}