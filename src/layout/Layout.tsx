import { LayoutProps } from './Layout.props';
import styles from './Layout.module.css';
import cn from 'classnames';
import { Header } from './Header/Header';
import React, {
  FunctionComponent,
  KeyboardEvent,
  useRef,
  useState,
} from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { Footer } from './Footer/Footer';
import { AppContextProvider, IAppContext } from '../context/app.context';

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const [isSkipLinkActive, setIsSkipLinkActive] = useState<boolean>(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const skipMenuAction = (key: KeyboardEvent) => {
    if (key.code === 'Space' || key.code === 'Enter') {
      key.preventDefault();
      bodyRef.current?.focus();
    }
    setIsSkipLinkActive(false);
  };

  return (
    <div className={styles.wrapper}>
      <a
        tabIndex={1}
        onKeyDown={skipMenuAction}
        onFocus={() => setIsSkipLinkActive(true)}
        className={cn(styles.skipLink, {
          [styles.displayed]: isSkipLinkActive,
        })}
      >
        Сразу к содержимому
      </a>
      <Header className={styles.header} />
      <Sidebar className={styles.sidebar} />
      <main className={styles.body} ref={bodyRef} tabIndex={0} role='main'>
        {children}
      </main>
      <Footer className={styles.footer} />
    </div>
  );
};

export const withLayout = <T extends Record<string, unknown> & IAppContext>(
  Component: FunctionComponent<T>
) => {
  return function withLayoutComponent(props: T): JSX.Element {
    return (
      <AppContextProvider menu={props.menu} firstCategory={props.firstCategory}>
        <Layout>
          <Component {...props} />
        </Layout>
      </AppContextProvider>
    );
  };
};
