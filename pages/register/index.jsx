import LandingPage from '@/components/LandingPage';
import React from 'react'

function index() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}

export default index


export async function getServerSideProps(context) {
  const { token } = context.req.cookies;
  console.log(token);
  if (token) {
    return {
      redirect: {
        destination: `/chat`,
        permanent: true,
      },
    };
  }
  return {
    props: {},
  };
}