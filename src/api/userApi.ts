import pdfApi from '../services/axios';
import errorHandler from './error';


interface userData {
    name?:string,
    email:string,
    password:string
}

export const signup = async(userData:userData)=>{
    try {
        console.log(userData,"userData----");
        const res = await pdfApi.post('/register',{userData})
        return res.data
    } catch (error) {
        console.error('Error uploading file:', error);
    // throw new Error('Error uploading file');
    const err: Error = error as Error;
    return errorHandler(err)
    }
}

export const loginUser = async(userLogin:userData)=>{
    try {
        console.log(userLogin); 
        // Send the userLogin directly, not wrapped in an object
        const res = await pdfApi.post('/login', {userLogin});
        console.log(res, "iiii");
        return res.data;
    } catch (error) {
        console.error('Error uploading file:', error);
    // throw new Error('Error uploading file');
    const err: Error = error as Error;
    return errorHandler(err)
    }
}