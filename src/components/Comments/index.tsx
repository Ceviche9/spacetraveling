/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable class-methods-use-this */
import { useEffect } from 'react';

const commentNodeId = 'comments';

export type CommentsProps = {
  sugestions: {
    prevPost?: {
      uid: string;
      data: {
        title: string;
      };
    }[];
    nextPost?: {
      uid: string;
      data: {
        title: string;
      };
    }[];
  };
};

const Comments = ({ sugestions }: CommentsProps): JSX.Element => {
  console.log('Teste', sugestions);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.setAttribute('repo', 'Ceviche9/spacetraveling');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'Comment');
    script.setAttribute('theme', 'dark-blue');
    script.setAttribute('crossorigin', 'anonymous');
    const scriptParentNode = document.getElementById(commentNodeId);
    scriptParentNode.appendChild(script);
    return () => {
      // cleanup - remove the older script with previous theme
      scriptParentNode.removeChild(scriptParentNode.firstChild);
    };
  }, [sugestions]);

  return <div id={commentNodeId} />;
};

export default Comments;
