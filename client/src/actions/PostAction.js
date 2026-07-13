import * as PostApi from '../api/PostRequest';

export const getTimelinePosts = (id) => async (dispatch) => {

    dispatch({ type: "RETRIEVING_START" });

    try {
        const { data } = await PostApi.getTimelinePosts(id);
        dispatch({ type: "RETRIEVING_SUCCESS", data: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "RETRIEVING_FAIL" });
    }
}

export const deletePost = (postId, userId) => async (dispatch) => {
    try {
        await PostApi.deletePost(postId, userId);
        dispatch({ type: "DELETE_POST", data: postId });
    } catch (error) {
        console.log(error);
    }
}
