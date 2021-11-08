/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable class-methods-use-this */
import { Component } from 'react';

export default class Comments extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    const anchor = document.getElementById('inject-comments-for-uterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute('repo', 'ceviche9/spacetraveling');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'dark-blue');
    anchor.appendChild(script);
  }

  /* themes =>
   github-dark-orange
   icy-dark
   dark-blue
   photon-dark
   gruvbox-dark
  */
  render() {
    return <div id="inject-comments-for-uterances" />;
  }
}
