import { ORIGIN_BOTTOM, ORIGIN_TOP } from './constants'
import { bool, func, instanceOf, number, object, objectOf, string } from 'prop-types'
import { eachDayOfInterval, isSameMonth, lightFormat, startOfMonth } from 'date-fns'

import CalendarDay from './CalendarDay'
import React from 'react'
import classNames from 'classnames'
import useGrid from './useGrid'

const computeModifiers = (modifiers, date) => {
  const computedModifiers = {}

  Object.keys(modifiers).map(key => {
    computedModifiers[key] = modifiers[key](date)
  })

  return computedModifiers
}

export default function CalendarGrid({
  locale,
  month,
  modifiers,
  modifiersClassNames,
  onMonthChange,
  onDayHover,
  onDayClick,
  transitionDuration,
  touchDragEnabled
}) {
  const grid = useGrid({ locale, month: startOfMonth(month), onMonthChange, transitionDuration, touchDragEnabled })
  const { startDate, endDate, cellHeight, containerElementRef, isWide, offset, origin, transition } = grid

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  }).map(date => {
    return (
      <CalendarDay
        date={date}
        height={cellHeight}
        key={lightFormat(date, 'yyyy-MM-dd')}
        locale={locale}
        modifiers={{
          ...computeModifiers(modifiers, date),
          outside: !isSameMonth(date, month),
          wide: isWide
        }}
        modifiersClassNames={modifiersClassNames}
        onHover={onDayHover}
        onClick={onDayClick}
      />
    )
  })

  return (
    <div className='nice-dates-grid'>
      <div
        className={classNames('nice-dates-grid_container', {
          '-moving': offset,
          '-origin-bottom': origin === ORIGIN_BOTTOM,
          '-origin-top': origin === ORIGIN_TOP,
          '-transition': transition
        })}
        ref={containerElementRef}
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          transitionDuration: `${transitionDuration}ms`
        }}
      >
        {days}
      </div>
    </div>
  )
}

CalendarGrid.propTypes = {
  locale: object.isRequired,
  month: instanceOf(Date).isRequired,
  modifiers: objectOf(func),
  modifiersClassNames: objectOf(string),
  onMonthChange: func.isRequired,
  onDayHover: func,
  onDayClick: func,
  transitionDuration: number.isRequired,
  touchDragEnabled: bool
}

CalendarGrid.defaultProps = {
  modifiers: {},
  transitionDuration: 500,
  touchDragEnabled: true
}
