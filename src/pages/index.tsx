/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { GetStaticProps } from 'next';

import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client';

import {
  AiTwotoneCalendar as CalendarIcon,
  AiOutlineUser as UserIcon,
} from 'react-icons/ai';
import { format } from 'date-fns';
import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

type Post = {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
};

type PostPagination = {
  next_page: string;
  results: Post[];
};

type HomeProps = {
  postsPagination: PostPagination;
};

export default function Home(props: HomeProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Post | spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {props.postsPagination.results.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a href="">
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div>
                  <time>
                    <CalendarIcon /> {post.first_publication_date}
                  </time>
                  <p>
                    <UserIcon /> {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
        <h4>Carregar mais Posts</h4>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['document.title', 'document.subtitle'],
      pageSize: 100,
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        Date.parse(post.first_publication_date),
        'dd MMM yyyy'
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = { results, next_page: postsResponse.next_page };
  return {
    props: { postsPagination },
  };
};
