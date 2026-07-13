import * as UploadApi from '../api/UploadRequest'

export const uploadImage = (data) => async (dispatch) => {

    try {
        return await UploadApi.uploadImage(data)
    } catch (error) {
        console.log(error)
        throw error
    }
}


export const uploadPost = (data) => async (dispatch) => {
    dispatch({ type: 'UPLOAD_START' })
    try {
        const newPost = await UploadApi.uploadPost(data)
        dispatch({ type: 'UPLOAD_SUCCESS', data: newPost.data })
    } catch (error) {
        console.log(error)
        dispatch({ type: 'UPLOAD_FAIL' })
    }
}
