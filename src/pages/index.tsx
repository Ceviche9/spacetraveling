/* eslint-disable no-alert */
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
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { toast } from 'react-toastify';
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const notifyError = (err: string) => {
    toast.error(err, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const loadPosts = async (): Promise<void> => {
    setShowLoading(true);
    setTimeout(async () => {
      if (nextPage) {
        try {
          const response = fetch(nextPage);
          const data: Promise<PostPagination> = (await response).json();
          const newPosts = (await data).results.map((post: Post) => ({
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              'dd MMM yyyy',
              { locale: ptBR }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          }));

          setNextPage((await data).next_page);
          setPosts([...posts, ...newPosts]);
          setShowLoading(false);
        } catch (err) {
          setShowLoading(false);
          // TODO: Não funciona.
          notifyError('Um erro ocorreu ao tentar carregar mais posts!');
        }
      }
    }, 200);
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
                    <CalendarIcon />{' '}
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      { locale: ptBR }
                    )}
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
      pageSize: 2,
      orderings: '[document.first_publication_date]',
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };
  return {
    props: { postsPagination },
    revalidate: 60 * 30,
  };
};
