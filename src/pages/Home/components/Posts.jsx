import React, { useCallback, useEffect, useState } from 'react';
import News from './News';
import NewsModal from './NewsModal';


function Posts ({fromFile}) {
  const [ items, setItems ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const getPosts = useCallback( async () => {
    const { posts } = require('../../../static/posts/' + fromFile);

    let listPosts = []

    for (let i = 0; i < posts.length; i++) {
      const sumFilePath = require(`../../../static/posts/${posts[i].summary}`);
      const summary = await fetch(sumFilePath).then( response => response.text() );

      const fullFilePath = require(`../../../static/posts/${posts[i].full_content}`);
      const content = await fetch(fullFilePath).then( response => response.text() );
      
      listPosts.push({
        ...posts[i],
        'summary': summary,
        'content': content,
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
    <div className="news-container">
      {
        loading ? 
        <p>Cargando ...</p>
        :
        items.map( (item, index) => (
          <div className="news-item" key={index}>
            <News post={item} index={index} />
            <NewsModal post={item} index={index} /> 
          </div>
        ))     
      }
    </div>
  );
}

export default Posts