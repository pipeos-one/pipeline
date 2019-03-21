import {DStorageType} from '../interfaces';
import {DStorageController} from '../controllers/dstorage.controller';

const UPLOAD_RETRIES = 40;

export const retryDstorageUpload = async (
    type: DStorageType,
    content: string,
    contentType: string = 'Json',
    retries: number = 0,
): Promise<string | undefined> => {
    let hash;
    const dstorage = new DStorageController();

    try {
        hash = (await dstorage.post(type, content, contentType))[0];
    } catch(error) {
        retries += 1;
    }
    console.log('--- retryDstorageUpload', type, retries, hash, contentType);
    if (!hash && retries <= UPLOAD_RETRIES) {
        await waitAsync(500);
        return retryDstorageUpload(type, content, contentType, retries);
    }
    return hash;
}

export const dsProtocol = (type: DStorageType): string => {
    return `${type == 'swarm' ? 'bzz-raw' : 'ipfs'}://`;
}

async function waitAsync(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}
