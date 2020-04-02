import React from 'react';

const PlayButton = (props)=> (
    <div className={'play-button'}>
        {props.playing ? '▶️' : '⏸'}
    </div>
)

export default PlayButton;