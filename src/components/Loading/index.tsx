import ReactLoading from 'react-loading';

export const Loading = ({ type, color }): JSX.Element => {
  return (
    <>
      <ReactLoading type={type} color={color} height="20%" width="20%" />
    </>
  );
};
