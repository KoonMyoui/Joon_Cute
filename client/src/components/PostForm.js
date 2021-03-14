
import React from 'react'
import {Button, Form} from 'semantic-ui-react'
import {useForm} from '../util/hooks'

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    });

    // hook ข้อมูลมา ตัว Schema
    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy,result) {

            const data = proxy.readQuery({ //อันนี้น่าจะจัดการข้อมูลใน cache 
                query: FETCH_POSTS_QUERY
            });

            data.getPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });

            values.body = '';
        }
    });

    function createPostCallback() {
        createPost();
    }


    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post off joon:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi Joon"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                        />
                    <Button disabled={!values.body.trim()} type="submit" color="orange">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{ marginBottom: 20 }}>
                    <ul className="list">
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    )
}
//ไปดึงข้อมูลในดาต้าเบสมา
const CREATE_POST_MUTATION = gql` 
    mutation createPost($body: String!) {
    createPost(body: $body) {
        id
        body
        createdAt
        username
        likes {
            id
            username
            createdAt
        }
        likeCount
        comments {
            id
            body
            username
            createdAt
        }
        commentCount
        }
    }
`;


export default PostForm;