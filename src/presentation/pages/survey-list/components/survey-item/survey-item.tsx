import { Icon, IconName } from '@/presentation/components'
import React from 'react'

import Styles from './survey-item-styles.scss'

const SurveyItem: React.FC = () => {
  return (
    <li className={Styles.surveyItemWrap}>
      <div className={Styles.surveyContent}>
        <Icon iconName={IconName.thumbDown} className={Styles.iconWrap} />
        <time>
          <span className={Styles.day}>12</span>
          <span className={Styles.month}>02</span>
          <span className={Styles.year}>2021</span>
        </time>
        <p>Qual é seu framework web favorito ?</p>
      </div>
      <footer>Ver Resultado</footer>
    </li>
  )
}

export default SurveyItem
