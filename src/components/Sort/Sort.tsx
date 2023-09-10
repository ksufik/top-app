import { SortEnum, SortProps } from './Sort.props';
import styles from './Sort.module.css';
import SortIcon from './sort.svg';
import cn from 'classnames';
import { KeyboardEvent } from 'react';

export const Sort = ({
  sort,
  setSort,
  className,
  ...props
}: SortProps): JSX.Element => {
  const handleKeyDown = (key: KeyboardEvent, sort: SortEnum) => {
    if (key.code === 'Enter' || key.code === 'Space') {
      key.preventDefault();
      setSort(sort);
    }
  };
  return (
    <div className={cn(styles.sort, className)} {...props}>
      <span
        onClick={() => setSort(SortEnum.Rating)}
        onKeyDown={(e) => handleKeyDown(e, SortEnum.Rating)}
        className={cn({
          [styles.active]: sort === SortEnum.Rating,
        })}
        tabIndex={sort == SortEnum.Rating ? -1 : 0}
        aria-label="Сортировка по рейтингу"
        aria-selected={true}
      >
        <SortIcon className={styles.sortIcon} />
        По рейтингу
      </span>
      <span
        onClick={() => setSort(SortEnum.Price)}
        className={cn({
          [styles.active]: sort === SortEnum.Price,
        })}
        tabIndex={sort == SortEnum.Price ? -1 : 0}
        onKeyDown={(e) => handleKeyDown(e, SortEnum.Price)}
        aria-label="Сортировка по цене"
        aria-selected={sort === SortEnum.Price}
      >
        <SortIcon className={styles.sortIcon} />
        По цене
      </span>
    </div>
  );
};
