import React from 'react';
import { area, curveBasis } from 'd3-shape';
import PropTypes from 'prop-types';

const AreaClipContainer = ({
    data = [],
    selectX = datum => datum.x,
    selectY0 = datum => datum.y0,
    selectY = datum => datum.y,
    interpolation = curveBasis,
    children
}) => {
    if (!children[0].props.data) return;
    if (!data.length) return (
        <g>
            {children}
        </g>
    );

    const rndId = Math.random().toString().replace('.', '');

    const { scale } = children[0].props
    const clipAreaPath = area()
        .x(datum => scale.x(selectX(datum)))
        .y0(datum => scale.y(selectY0(datum)))
        .y1(datum => scale.y(selectY(datum)))
        .curve(interpolation)(data);

    return (
        <g>
            <defs>
                <clipPath id={`area-clip-${rndId}`}>
                    <path d={clipAreaPath} />
                </clipPath>
            </defs>

            <g clipPath={`url(#area-clip-${rndId})`}>
                {children}
            </g>
        </g>
    )
}

AreaClipContainer.propTypes = {
    data: PropTypes.array,
    selectX: PropTypes.func,
    selectY: PropTypes.func,
    selectY0: PropTypes.func,
    interpolation: PropTypes.any,
}

export default AreaClipContainer;