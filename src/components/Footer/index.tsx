import Link from 'next/link';
import { AiOutlineGithub } from 'react-icons/ai';

import styles from './footer.module.scss';

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.container}>
      <Link href="https://github.com/Ceviche9">
        <a>Made by Tundê Cavalcante</a>
      </Link>
      <div>
        <AiOutlineGithub />
      </div>
    </footer>
  );
}
