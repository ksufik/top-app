import { Advantages, Htag, P, Product, Sort, Tag } from '../../components';
import { TopPageComponentProps } from './TopPageComponent.props';
import styles from './TopPageComponent.module.css';
import { HhData } from '../../components';
import { TopLevelCategory } from '../../interfaces/page.interface';
import { SortEnum } from '../../components/Sort/Sort.props';
import { useEffect, useReducer } from 'react';
import { sortReducer } from './sort.reducer';
import { useScrollY } from '@/helpers/useScroll';
import { useReducedMotion } from 'framer-motion';
import Head from 'next/head';

export const TopPageComponent = ({
  page,
  products,
  firstCategory,
}: TopPageComponentProps): JSX.Element => {
  const y = useScrollY();
  const shouldReduceMotion = useReducedMotion();
  const [{ products: sortedProducts, sort }, dispathSort] = useReducer(
    sortReducer,
    { products, sort: SortEnum.Rating }
  );

  const setSort = (sort: SortEnum) => {
    dispathSort({ type: sort });
  };

  useEffect(() => {
    dispathSort({ type: 'reset', initialState: products });
  }, [products]);

  return (
    <>
      {products && page && (
        <>
          <Head>
            <title>{page.metaTitle}</title>
            <meta name="description" content={page.metaDescription} />
            <meta property="og:title" content={page.metaTitle} />
            <meta property="og:description" content={page.metaDescription} />
            <meta property="og:image" content="" />{' '}
            {/* подставить сюда картинку */}
            <meta property="og:type" content="article" />
          </Head>

          <div className={styles.wrapper}>
            <div className={styles.title}>
              <Htag tag="h1">{page.title}</Htag>
              {products && (
                <Tag
                  color="grey"
                  size="m"
                  aria-label={products.length + 'элементов'}
                  id="num"
                >
                  <span aria-labelledby="num">{products.length}</span>
                </Tag>
              )}
              <Sort sort={sort} setSort={setSort} />
            </div>
            <div role="list">
              {sortedProducts &&
                sortedProducts.map((p) => (
                  <Product
                    layout={shouldReduceMotion ? false : true}
                    key={p._id}
                    product={p}
                    role="listitem"
                  />
                ))}
            </div>
            <div className={styles.hhTitle}>
              <Htag tag="h2">Вакансии - {page.category}</Htag>
              <Tag color="red" size="m">
                hh.ru
              </Tag>
            </div>
            {firstCategory == TopLevelCategory.Courses && page.hh && (
              <HhData {...page.hh} />
            )}
            {page.advantages && page.advantages.length > 0 && (
              <>
                <Htag tag="h2">Преимущства</Htag>
                <Advantages advantages={page.advantages} />
              </>
            )}
            {page.seoText && (
              <div
                className={styles.seo}
                dangerouslySetInnerHTML={{ __html: page.seoText }}
              />
            )}
            <Htag tag="h2">Получаемые навыки</Htag>
            {page.tags.map((t) => (
              <Tag key={t} color="primary">
                {t}
              </Tag>
            ))}
          </div>
        </>
      )}
    </>
  );
};
