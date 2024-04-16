//|-------------------|
//|     Node Data     |
//|-------------------|

/*
Node Data is a collection of data for each node.
    name:           The name of the node.
    type:           The type of calendar/time.
    epoch:          The starting epoch of the calendar/time.
    confidence:     A measure of how confident I am in the node's accuracy.
    description:    The text that appears on hover.
*/

const gregorian = {
    name: 'Gregorian',
    type: 'Solar Calendar',
    epoch: 'January 1st, 1 AD',
    condfidence: 'Exact',
    description: 'The Gregorian Calendar is the calendar used by most of the world. It has 365 days, with an extra leap day every 4 years while skipping years that are divisible by 400. It was issued by Pope Gregory XIII on October 15th, 1582 and is derived from the Julian Calendar after skipping 10 days between October 5th and 15th and differs via the 4-century leap year rule. This calendar is exactly accurate, however dates before October 15th 1582 are proleptic.'
}

const julian = {
    name: 'Julian',
    type: 'Solar Calendar',
    epoch: 'January 1st, 1 AD',
    condfidence: 'Exact',
    description: 'The Gregorian Calendar is the calendar used by most of the world. It has 365 days, with an extra leap day every 4 years while skipping years that are divisible by 400. It was issued by Pope Gregory XIII on October 15th, 1582 and is derived from the Julian Calendar after skipping 10 days between October 5th and 15th and differs via the 4-century leap year rule. This calendar is exactly accurate, however dates before October 15th 1582 are proleptic.'
}

window.gregorian = gregorian;