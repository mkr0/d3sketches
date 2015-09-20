#!/bin/bash

tmux has-session -t d3-sketches
if [ $? != 0 ]
then
    tmux new-session -s d3-sketches -n vim -d
    tmux send-keys -t d3-sketches 'vim' C-m
    tmux split-window -v -p 25 -t d3-sketches
    tmux send-keys -t d3-sketches 'git status' C-m
    tmux split-window -h -t d3-sketches
    tmux send-keys -t d3-sketches 'nvm use v4' C-m
fi
tmux attach -t d3-sketches
