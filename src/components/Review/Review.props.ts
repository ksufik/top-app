import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { ReviewModel } from '../../interfaces/product.interface';

export interface ReviewProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  review: ReviewModel;
  tabIndex?: 0 | -1;
}
