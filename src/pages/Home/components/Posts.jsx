import React, { useCallback, useEffect, useState } from 'react';
import Notice from './Notice';


function Posts ({fromFile}) {
  const [ items, setItems ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const getPosts = useCallback( async () => {
    const { posts } = require('../../../static/posts/' + fromFile);

    let listPosts = []

    for (let i = 0; i < posts.length; i++) {
      console.log(`../../../static/posts/${posts[i].summary}`)
      const filePath = require(`../../../static/posts/${posts[i].summary}`);
      const text = await fetch(filePath).then( response => response.text() );
      
      listPosts.push({
        'content': text,
        ...posts[i]
      })
    }
    return listPosts.sort((a, b) => (a.date < b.date));
  }, [fromFile]);

  useEffect( () => {
    setLoading(true);
    setTimeout( async () => {
      getPosts().then( (posts) => {
        setItems(posts);
      }).catch( () => {
        setItems([]);
      }).finally( () => {
        setLoading(false);
      })
    }, 300);
    return () => setItems([]);
  }, [getPosts])

  return (
    <> 
      { 
        loading ? 
        <p>Cargando ...</p>
        :
        items.map( (item, index) => 
          <Notice key={index} post={item} index={index} />
        )      
      }
    </>
  );
}

export default Posts