import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types';
import {
 useQuery,
 useMutation,
 useQueryClient,
 useInfiniteQuery
} from '@tanstack/react-query';
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserById, getUserPosts, getUsers, likePost, savePost, searchPosts, signInAccount,signOutAccount, updatePost, updateUser } from '../appwrite/api';
import { QUERY_KEYS } from './queryKey';

export const useCreateUserAccount=()=>
{
    return useMutation({
        mutationFn:(user:INewUser)=>createUserAccount(user),
    });
}
// Sign-in Account
export const useSignInAccount=()=>
{
    return useMutation({
        mutationFn:(user:{
            email:string;
            password:string
        })=>signInAccount(user),
       
    
    });
}

//Sign Out Account

export const useSignOutAccount=()=>
{
    return useMutation({
        mutationFn:signOutAccount,
       
    
    });
}

export const useCreatePost=()=>{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:(post:INewPost)=>createPost(post),
        onSuccess:()=>{
            queryClient.invalidateQueries(
                {
                    queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
                }
            )
        }
    })
}

// ** get Recent Post 

export const useGetRecentPosts=()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn:getRecentPosts,
        

    })
}

//use like post
export const useLikePost=()=>
{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:({postId,likesArray}:{postId:string;
            likesArray:string[]})=>likePost(postId,likesArray),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
             queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            }) 
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER,data?.$id]
            })

        }
    })
}

//use save like post
export const useSavePost=()=>
{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:({postId,userId}:{postId:string;
            userId:string})=>savePost(postId,userId),
        onSuccess:()=>{
            
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
             queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            }) 
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })
}

//use delete save post
export const useDeleteSavedPost=()=>
{
    const queryClient=useQueryClient();
    return useMutation({
        mutationFn:(savedRecordId:string)=>deleteSavedPost(savedRecordId),
        
        onSuccess:()=>{
            
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
             queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            }) 
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })

        }
    })
}
// get current user
export const useGetCurrentUser=()=>{
    return useQuery({
       queryKey:[QUERY_KEYS.GET_CURRENT_USER],
       queryFn:getCurrentUser
    })
    
}

//****get post */
export const useGetPostById=(postId:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
        queryFn:()=>getPostById(postId),
        enabled:!!postId
    }
    )
}

//** update post */
export const useUpdatePost=()=>{
    const queryClient =useQueryClient();
    return useMutation({
        mutationFn:(post:IUpdatePost)=>updatePost(post),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
            })
        }
    })
}
//

export const useDeletePost=()=>{
    const queryClient =useQueryClient();
    
    return useMutation({
        mutationFn:({postId,imageId}:{postId:string,imageId:
            string})=>deletePost(postId,imageId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}
// ** use infinit post*
export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        getNextPageParam: (lastPage: any) => {
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }
            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
        initialPageParam: undefined, // or provide an appropriate initial value
    });
};



 // Search Post
 export const useSearchPosts=(searchTerm:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
        queryFn:()=>searchPosts(searchTerm),
        enabled:!!searchTerm
    }
    )
 }

//*** get user post */
export const useGetUserPosts = (userId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
      queryFn: () => getUserPosts(userId),
      enabled: !!userId,
    });
  };

//**** use Get user */
export const useGetUsers = (limit?: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USERS],
          queryFn: () => getUsers(limit),
    });
  };

  // get user by Id
  export const useGetUserById = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
  };

  // use Update User 

  export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (user: IUpdateUser) => updateUser(user),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
        });
      },
    });
  };