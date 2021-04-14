import styled from 'styled-components'

import { BorderRad, Colors, Transitions } from '../constants'

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const ListItem = styled.li`
  display: grid;
  padding: 16px;
  border: 1px solid ${Colors.Black[100]};
  border-radius: ${BorderRad.s};
  background-color: ${Colors.White};
  transition: ${Transitions.all};

  & + & {
    margin-top: -1px;
  }
`