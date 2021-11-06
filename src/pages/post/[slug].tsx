/* eslint-disable react/no-danger */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import Head from 'next/head';
import Prismic from '@prismicio/client';

import { GetStaticPaths, GetStaticProps } from 'next';
import {
  AiTwotoneCalendar as CalendarIcon,
  AiOutlineUser as UserIcon,
  AiOutlineClockCircle as Clock,
} from 'react-icons/ai';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
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
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const totalWords = post.data.content.reduce((total, contentItem) => {
    let count = 0;
    count += contentItem.heading.split(' ').length;

    const wordsCounter = contentItem.body.map(
      item => item.text.split(' ').length
    );
    wordsCounter.map(words => (count += words));

    total += count;

    return total;
  }, 0);

  const readTime = Math.ceil(totalWords / 200);
  const formatedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
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
              <CalendarIcon /> {formatedDate}
            </time>
            <p>
              <UserIcon /> {post.data.author}
            </p>
            <p>
              <Clock /> {`${readTime} min`}
            </p>
          </div>
          <div className={styles.postContent}>
            <p>{post.data.subtitle}</p>
            {post.data.content.map(postContent => (
              <>
                <h2 key={post.uid}>{postContent.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(postContent.body),
                  }}
                />
              </>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking', // TODO: ao deixar como true dá erro na build.
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const content = response.data.content.map(contentData => {
    return {
      heading: contentData.heading,
      body: [...contentData.body],
    };
  });

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content,
    },
  };

  return {
    props: { post },
    revalidate: 60 * 30, // 30 Minutos
  };
};
