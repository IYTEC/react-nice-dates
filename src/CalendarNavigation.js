import { addMonths, format, getYear, isSameMonth, startOfMonth, subMonths } from 'date-fns'
import { func, instanceOf, object } from 'prop-types'

import React from 'react'
import classNames from 'classnames'

export default function CalendarNavigation({ locale, month, minimumDate, maximumDate, onMonthChange }) {
  const handlePrevious = event => {
    onMonthChange(startOfMonth(subMonths(month, 1)))
    event.preventDefault()
  }

  const handleNext = event => {
    onMonthChange(startOfMonth(addMonths(month, 1)))
    event.preventDefault()
  }

  return (
    <div className='nice-dates-navigation'>
      <div className='nice-dates-navigation_wrapper'>
        <a
          className={classNames('nice-dates-navigation_previous', {
            '-disabled': isSameMonth(month, minimumDate)
          })}
          onClick={handlePrevious}
          onTouchEnd={handlePrevious}
        />
        <span className='nice-dates-navigation_current'>
          {format(month, getYear(month) === getYear(new Date()) ? 'LLLL' : 'LLLL yyyy', { locale })}
        </span>
        <a
          className={classNames('nice-dates-navigation_next', {
            '-disabled': isSameMonth(month, maximumDate)
          })}
          onClick={handleNext}
          onTouchEnd={handleNext}
        />
      </div>
    </div>
  )
}

CalendarNavigation.propTypes = {
  locale: object.isRequired,
  month: instanceOf(Date).isRequired,
  minimumDate: instanceOf(Date),
  maximumDate: instanceOf(Date),
  onMonthChange: func.isRequired
}
