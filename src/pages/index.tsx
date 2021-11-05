/* eslint-disable no-nested-ternary */
import { GetStaticProps } from 'next';

import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client';

import {
  AiTwotoneCalendar as CalendarIcon,
  AiOutlineUser as UserIcon,
} from 'react-icons/ai';
import { format } from 'date-fns';
import { useState } from 'react';
import { setTimeout } from 'timers';
import { getPrismicClient } from '../services/prismic';
import { Loading } from '../components/Loading';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { next_page, results } = postsPagination;
  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState<string>(next_page);
  const [showLoading, setShowLoading] = useState(false);

  const loadPosts = (): void => {
    setShowLoading(true);
    setTimeout(() => {
      if (nextPage) {
        fetch(nextPage)
          .then(response => response.json())
          .then(data => {
            const newPosts = data.results.map((post: Post) => ({
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
            }));

            setNextPage(data.next_page);
            setPosts([...posts, ...newPosts]);
            setShowLoading(false);
          })
          .catch(() => {
            setShowLoading(false);
            alert('Erro na aplicação!');
          });
      }
    }, 1500);
  };

  const handleLoadPostsClick = (): void => {
    loadPosts();
  };

  return (
    <>
      <Head>
        <title>Post | spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div>
                  <p>
                    <CalendarIcon /> {post.first_publication_date}
                  </p>
                  <p>
                    <UserIcon /> {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {nextPage ? (
          showLoading ? (
            <Loading type="bubbles" color="#FF57B2" />
          ) : (
            <button type="button" onClick={handleLoadPostsClick}>
              <p>Carregar mais posts</p>
            </button>
          )
        ) : null}
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
      pageSize: 2,
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
