import React, {useEffect ,useState} from 'react';
import {Link} from 'react-router-dom';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks'
import { Button, Label, Icon } from 'semantic-ui-react';

function LikeButton({user,post:{id,likeCount,likes}}) {
    const [liked, setLiked] = useState(false);

    useEffect(() =>{
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true);
        } else setLiked(false);
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    });

    const likeButton = user ? (//login ยัง
        liked ? ( //กด like ยัง
            <Button color='orange' >
                <Icon name='heart' />
                {/* Like ใส่คำได้*/}
            </Button>
        ) : (
            <Button color='orange' basic>
                <Icon name='heart' />
                {/* Like ใส่คำได้*/}
            </Button>
        )
    ):(
        <Button as ={Link} to="/login" color='orange' basic>
            <Icon name='heart' />
            {/* Like ใส่คำได้*/}
        </Button>
    )

    return(
        <Button as='div' labelPosition='right' onClick={likePost}>
                {likeButton}
                <Label basic color='orange' pointing='left'>
                    {likeCount}
                </Label>
        </Button>
    )

}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
            id
            username
            }
            likeCount
        }
    }
`;

export default LikeButton;