import { RatingProps } from './Rating.props';
import styles from './Rating.module.css';
import cn from 'classnames';
import StarIcon from './star.svg';
import {
  useEffect,
  useState,
  KeyboardEvent,
  forwardRef,
  ForwardedRef,
  useRef,
} from 'react';

export const Rating = forwardRef(
  (
    {
      isEditable = false,
      error,
      rating,
      tabIndex = 0,
      setRating,
      ...props
    }: RatingProps,
    ref: ForwardedRef<HTMLDivElement>
  ): JSX.Element => {
    const [ratingArray, setRatingArray] = useState<JSX.Element[]>(
      new Array(5).fill(<></>)
    );
    const ratingArrayRef = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
      constructRating(rating);
    }, [rating, tabIndex]);

    const changeDispay = (i: number) => {
      if (!isEditable) {
        return;
      }
      constructRating(i);
    };

    const onClick = (i: number) => {
      if (!isEditable || !setRating) {
        return;
      }
      setRating(i);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (!isEditable || !setRating) {
        return;
      }
      if (e.code === 'ArrowRight' || e.code === 'ArrowUp') {
        if (!rating) setRating(1);
        else {
          e.preventDefault();
          setRating(rating < 5 ? rating + 1 : 5);
        }
        ratingArrayRef?.current[rating]?.focus();
      }

      if (e.code === 'ArrowLeft' || e.code === 'ArrowDown') {
        e.preventDefault();
        setRating(rating > 0 ? rating - 1 : 0);
        ratingArrayRef?.current[rating - 2]?.focus();
      }
    };

    const computeFocus = (rating: number, index: number): number => {
      if (!rating && index === 0) return tabIndex;

      if (rating === index + 1) return tabIndex;

      return -1;
    };

    const constructRating = (currentRating: number) => {
      const updatedArray = ratingArray.map((r: JSX.Element, i: number) => {
        return (
          <span
            className={cn(styles.star, {
              [styles.filled]: i < currentRating,
              [styles.editable]: isEditable,
            })}
            onMouseEnter={() => changeDispay(i + 1)}
            onMouseLeave={() => changeDispay(rating)}
            onClick={() => onClick(i + 1)}
            onKeyDown={handleKey}
            tabIndex={computeFocus(rating, i)}
            ref={(r) => ratingArrayRef.current?.push(r)}
            role={isEditable ? 'slider' : ''}
            aria-valuenow={rating}
            aria-valuemin={1}
            aria-valuemax={5}
            aria-label={
              isEditable
                ? 'Укажите ретинг тсралками вверх и вниз'
                : `рейтинг ${rating}`
            }
						 aria-invalid={error ? true : false}
						 
          >
            <StarIcon />
          </span>
        );
      });
      setRatingArray(updatedArray);
    };

    return (
      <div
        {...props}
        ref={ref}
        className={cn(styles.ratingWrapper, {
          [styles.error]: error,
        })}
      >
        {ratingArray.map((r, i) => (
          <span key={i}>{r}</span>
        ))}
        {error && <span role="alert" className={styles.errorMessage}>{error.message}</span>}
      </div>
    );
  }
);
