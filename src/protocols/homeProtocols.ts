export type PostProps = {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
};

export type PostPaginationProps = {
  next_page: string;
  results: PostProps[];
};

export type HomeProps = {
  postsPagination: PostPaginationProps;
};
