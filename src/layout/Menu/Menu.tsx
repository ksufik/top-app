import styles from './Menu.module.css';
import cn from 'classnames';
import { KeyboardEvent, useContext, useState } from 'react';
import { AppContext } from '../../context/app.context';
import { FirstLevelMenuItem, PageItem } from '../../interfaces/menu.interface';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { firstLevelMenu } from '../../helpers/helpers';
import { motion, useReducedMotion } from 'framer-motion';

export const Menu = (): JSX.Element => {
  const { menu, setMenu, firstCategory } = useContext(AppContext);
  const [announce, setAnnounce] = useState<'closed' | 'open' | undefined>();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    visible: {
      marginBottom: 20,
      transition: shouldReduceMotion
        ? {}
        : {
            when: 'beforeChiildren',
            staggerChildren: 0.1,
          },
    },
    hidden: { marginBottom: 0 },
  };

  const variantsChildren = {
    visible: {
      opacity: 1,
      height: 29,
    },
    hidden: { opacity: shouldReduceMotion ? 1 : 0, height: 0 },
  };

  const openSecondLevel = (secondCategory: string) => {
    setMenu &&
      setMenu(
        menu.map((m) => {
          if (m._id.secondCategory == secondCategory) {
            setAnnounce(m.isOpened ? 'closed' : 'open');
            m.isOpened = !m.isOpened;
          }
          return m;
        })
      );
  };

  const openSecondLevelByKey = (key: KeyboardEvent, secondCategory: string) => {
    if (key.code === 'Space' || key.code === 'Enter') {
      key.preventDefault();
      openSecondLevel(secondCategory);
    }
  };

  const buildFirstLevel = () => {
    return (
      <ul>
        {firstLevelMenu.map((m) => (
          <li key={m.route} aria-expanded={m.id == firstCategory}>
            <Link href={`/${m.route}`}>
              <div
                className={cn(styles.firstLevel, {
                  [styles.firstLevelActive]: m.id == firstCategory,
                })}
              >
                {m.icon}
                <span>{m.name}</span>
              </div>
            </Link>
            {m.id == firstCategory && buildSecondLevel(m)}
          </li>
        ))}
      </ul>
    );
  };

  const buildSecondLevel = (menuItem: FirstLevelMenuItem) => {
    return (
      <ul className={styles.secondBlock}>
        {menu.map((m) => {
          if (
            m.pages.map((p) => p.alias).includes(router.asPath.split('/')[2])
          ) {
            m.isOpened = true;
          }
          return (
            <li key={m._id.secondCategory}>
              <button
                className={styles.secondLevel}
                onClick={() => openSecondLevel(m._id.secondCategory)}
                aria-expanded={m.isOpened}
                onKeyDown={(key: KeyboardEvent) =>
                  openSecondLevelByKey(key, m._id.secondCategory)
                }
              >
                {m._id.secondCategory}
              </button>
              {m.isOpened && (
                <motion.ul
                  layout
                  variants={variants}
                  initial={m.isOpened ? 'visible' : 'hidden'}
                  animate={m.isOpened ? 'visible' : 'hidden'}
                  className={cn(styles.secondLevelBlock)}
                >
                  {buildThirdLevel(
                    m.pages,
                    menuItem.route,
                    m.isOpened ?? false
                  )}
                </motion.ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const buildThirdLevel = (
    pages: PageItem[],
    route: string,
    isOpened: boolean
  ) => {
    return pages.map((p) => (
      <motion.li
        key={p._id}
        variants={variantsChildren}
        aria-current={`/${route}/${p.alias}` == router.asPath ? 'page' : false}
      >
        <Link
          href={`/${route}/${p.alias}`}
          tabIndex={isOpened ? 0 : -1}
          className={cn(styles.thirdLevel, {
            [styles.thirdLevelActive]: `/${route}/${p.alias}` == router.asPath,
          })}
        >
          {p.category}
        </Link>
      </motion.li>
    ));
  };

  return (
    <nav className={styles.menu} role="navigation">
      <span className={styles.visuallyHidden} role="log">
        {announce === 'open' ? 'развернуто' : 'свернуто'}
      </span>
      {buildFirstLevel()}
    </nav>
  );
};
