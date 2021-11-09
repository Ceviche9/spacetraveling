import { useEffect } from 'react';
import { CommentsProps } from '../../protocols/CommentsProtocols';

const commentNodeId = 'comments';

const Comments = ({ sugestions }: CommentsProps): JSX.Element => {
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
      scriptParentNode.removeChild(scriptParentNode.firstChild);
    };
  }, [sugestions]);

  return <div id={commentNodeId} />;
};

export default Comments;
