import React from 'react';
import { ReactComponent as HeartIcon } from '../../assets/images/heart.svg';
import './index.scss';

const Footer = () => {
  return (
    <footer className='text-center'>
      <div>
        <a
          {...{
            target: '_blank'
          }}
          className='d-flex align-items-center'
          href="#"
        >
          Made with <HeartIcon className='mx-1' /> by Carlo.
        </a>
      </div>
    </footer>
  );
};

export default Footer;
