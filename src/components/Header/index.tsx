import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export const Header = (): JSX.Element => {
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <Image
          src="/images/Logo.svg"
          alt="Logo do spacetraveling"
          width={238}
          height={25}
        />
      </Link>
    </header>
  );
};
