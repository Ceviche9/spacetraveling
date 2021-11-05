/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
import Head from 'next/head';
import Prismic from '@prismicio/client';

import { GetStaticPaths, GetStaticProps } from 'next';
import {
  AiTwotoneCalendar as CalendarIcon,
  AiOutlineUser as UserIcon,
  AiOutlineClockCircle as Clock,
} from 'react-icons/ai';
import { format } from 'date-fns';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
      count: number;
    }[];
    reading_time: number;
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Post | {post.data.title}</title>
      </Head>
      <main className={styles.container}>
        <img
          src={post.data.banner?.url ?? '/images/Banner.svg'}
          alt="Banner do Post"
        />
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
            <time>
              <CalendarIcon /> {post.first_publication_date}
            </time>
            <p>
              <UserIcon /> {post.data.author}
            </p>
            <p>
              <Clock /> {post.data.reading_time} min
            </p>
          </div>
          {post.data.content.map((postContent, index) => (
            <div key={index} className={styles.postContent}>
              <h2>{postContent.heading}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: String(postContent.body) }}
              />
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['document.uid'],
      pageSize: 2,
    }
  );

  const postsUid = posts.results.map(post => post.uid);

  return {
    paths: [
      { params: { slug: postsUid[0] } },
      { params: { slug: postsUid[1] } },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  let count = 0;

  const content = response.data.content.map(contentData => {
    count += RichText.asHtml(contentData.body).length;
    return {
      heading: contentData.heading,
      body: RichText.asHtml(contentData.body),
    };
  });

  const post = {
    first_publication_date: format(
      Date.parse(response.first_publication_date),
      'dd MMM yyyy'
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content,
      reading_time: Math.round(count / 200),
    },
  };

  return {
    props: { post },
    revalidate: 60 * 30, // 30 Minutos
  };
};
