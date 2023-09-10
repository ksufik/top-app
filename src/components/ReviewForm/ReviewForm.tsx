import { ReviewFormProps } from './ReviewForm.props';
import cn from 'classnames';
import { Input } from '../Input/Input';
import { Rating } from '../Rating/Rating';
import { Textarea } from '../Textarea/Textarea';
import { Button } from '../Button/Button';
import { useForm, Controller } from 'react-hook-form';
import { IReviewForm, IReviewSentResponse } from './ReviewForm.interface';
import axios from 'axios';
import { API } from '../../helpers/api';
import { useState } from 'react';
import styles from './ReviewForm.module.css';
import CloseIcon from './close.svg';

export const ReviewForm = ({
  productId,
  className,
  isReviewOpened,
  ...props
}: ReviewFormProps): JSX.Element => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<IReviewForm>();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const onSubmit = async (formData: IReviewForm) => {
    try {
      const { data } = await axios.post<IReviewSentResponse>(
        API.review.createDemo,
        { ...formData, productId }
      );
      if (data.message) {
        setIsSuccess(true);
        reset();
      } else {
        setError('Что-то пошло не так');
      }
    } catch (e: any) {
      setError(e?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={cn(styles.reviewForm, className)} {...props}>
        <Input
          {...register('name', {
            required: { value: true, message: 'Заполните имя' },
          })}
          placeholder="Имя"
          error={errors.name}
          tabIndex={isReviewOpened ? 0 : -1}
          aria-invalid={errors.name ? true : false}
        />
        <Input
          {...register('title', {
            required: { value: true, message: 'Заполните заголовок' },
          })}
          placeholder="Заголовок отзыва"
          className={styles.title}
          error={errors.title}
          tabIndex={isReviewOpened ? 0 : -1}
          aria-invalid={errors.title ? true : false}
        />
        <div className={styles.rating}>
          <span>Оценка:</span>
          <Controller
            control={control}
            name="rating"
            rules={{ required: { value: true, message: 'Укажите рейтинг' } }}
            render={({ field }) => (
              <Rating
                isEditable
                rating={field.value}
                ref={field.ref}
                setRating={field.onChange}
                error={errors.rating}
                tabIndex={isReviewOpened ? 0 : -1}
              />
            )}
          />
        </div>
        <Textarea
          {...register('description', {
            required: { value: true, message: 'Заполните описание' },
          })}
          placeholder="Текст отзыва"
          className={styles.description}
          error={errors.description}
          tabIndex={isReviewOpened ? 0 : -1}
          aria-label="Текст отзыва"
          aria-invalid={errors.description ? true : false}
        />
        <div className={styles.submit}>
          <Button
            appearance="primary"
            tabIndex={isReviewOpened ? 0 : -1}
            onClick={() => clearErrors()}
          >
            Отправить
          </Button>
          <span className={styles.info}>
            * Перед публикацией отзыв пройдет предварительную модерацию и
            проверку
          </span>
        </div>
      </div>
      {isSuccess && (
        <div className={cn(styles.success, styles.panel)}>
          <span className={styles.successTitle} role="alert">
            Ваш отзыв отправлен
          </span>
          <br />
          Спасибо, ваш отзыв будет опубликован после проверки.
          <button className={styles.close} onClick={() => setIsSuccess(false)}>
            <CloseIcon aria-label="Закрыть оповещение" />
          </button>
        </div>
      )}
      {error && (
        <div className={cn(styles.error, styles.panel)}>
          <span role="alert">
            Что-то пошло не так, попробуйте обновить страницу
          </span>

          <button className={styles.close} onClick={() => setError(undefined)}>
            <CloseIcon aria-label="Закрыть оповещение" />
          </button>
        </div>
      )}
    </form>
  );
};
