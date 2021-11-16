/* eslint-disable react/no-danger */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import Head from 'next/head';
import Link from 'next/link';
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

import Comments from '../../components/Comments';

import { prismicResponseProps } from '../../protocols/postProtocols';

import styles from './post.module.scss';

export default function Post({
  post,
  sugestions,
}: prismicResponseProps): JSX.Element {
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
  const firstPublicationDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  const lastPublicationDate = format(
    new Date(post.last_publication_date),
    "'*editado em' dd MMM yyyy, 'às' H':'m",
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
              <CalendarIcon /> {firstPublicationDate}
            </time>
            <p>
              <UserIcon /> {post.data?.author ?? 'Tundê Cavalcante'}
            </p>
            <p>
              <Clock /> {`${readTime} min`}
            </p>
          </div>
          {lastPublicationDate ? <span>{lastPublicationDate}</span> : null}
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
        <section className={styles.sugestions}>
          {sugestions.prevPost[0] ? (
            <div>
              <p>{sugestions.prevPost[0].data.title}</p>
              <Link href={`/post/${sugestions.prevPost[0].uid}`}>
                <a>Post anterior</a>
              </Link>
            </div>
          ) : null}
          {sugestions.nextPost[0] ? (
            <div>
              <p>{sugestions.nextPost[0].data.title}</p>
              <Link href={`/post/${sugestions.nextPost[0].uid}`}>
                <a>Próximo post</a>
              </Link>
            </div>
          ) : null}
        </section>
      </main>
      <Comments sugestions={sugestions} />
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
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const prevPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const nextPost = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const content = response.data.content.map(contentData => {
    return {
      heading: contentData.heading,
      body: [...contentData.body],
    };
  });

  const lastPublicationDate =
    response.last_publication_date === response.first_publication_date
      ? null
      : response.last_publication_date;

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: lastPublicationDate,
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

  const sugestions = {
    prevPost: prevPost?.results,
    nextPost: nextPost?.results,
  };

  return {
    props: { post, sugestions },
    revalidate: 60 * 30, // 30 Minutos
  };
};
