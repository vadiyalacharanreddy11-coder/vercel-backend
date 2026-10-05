 import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey:"public_beCxqSd27q7fT5kt+xBbgFr+DiM=",
    privateKey:"private_JIqTsxmhsokPk/WnWPqxMx8s1pE=",
    urlEndpoint:"https://ik.imagekit.io/yr41yms9t",
})

 export  const uploadFun = async (file,filename)=>{
    const result = await imagekit.upload({
        file,
        fileName:filename,
    })
    return result;
}