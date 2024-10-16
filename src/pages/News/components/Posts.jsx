import React, { useCallback, useEffect, useState } from 'react';
import NewsPost from './NewsPost';
import NewsModal from './NewsModal';

import loadingGif from "../../../static/booth/loading.gif";


function Posts ({fromFile}) {
  const [ items, setItems ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const getPosts = useCallback( async () => {
    const { data } = require('../../../static/data/' + fromFile);

    let listPosts = []

    for (let i = 0; i < data.length; i++) {
      const sumFilePath = require(`../../../static/data/${data[i].summary}`);
      const summary = await fetch(sumFilePath).then( response => response.text() );

      const fullFilePath = require(`../../../static/data/${data[i].full_content}`);
      const content = await fetch(fullFilePath).then( response => response.text() );
      
      listPosts.push({
        ...data[i],
        'summary': summary,
        'content': content,
      })
    }
    return listPosts.sort((a, b) => (a.date < b.date));
  }, [fromFile]);

  useEffect( () => {
    setLoading(true);
    setTimeout( async () => {
      getPosts().then( (data) => {
        setItems(data);
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
        <div className="loading-news">
          <img src={loadingGif} alt="Cargando..." />
        </div>
        :
        items.map( (item, index) => (
          <div className="news-item" key={index}>
            <NewsPost post={item} index={index} />
            <NewsModal post={item} index={index} /> 
          </div>
        ))     
      }
    </div>
  );
}

export default Posts