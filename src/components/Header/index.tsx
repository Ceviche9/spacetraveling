import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export const Header = (): JSX.Element => {
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <a>
          <Image src="/images/Logo.svg" alt="logo" width={238} height={25} />
        </a>
      </Link>
    </header>
  );
};
