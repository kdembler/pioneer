import BN from 'bn.js'
import React from 'react'
import styled from 'styled-components'

import { FundingPeriodDetailsContext, GeneralParametersContext } from '@/bounty/modals/AddBountyModal/machine'
import { InputComponent, InputNumber, Label, ToggleCheckbox } from '@/common/components/forms'
import { ColumnGapBlock, RowGapBlock } from '@/common/components/page/PageContent'
import { Tooltip, TooltipContainer, TooltipDefault } from '@/common/components/Tooltip'
import { TextMedium } from '@/common/components/typography'
import { BN_ZERO, Colors } from '@/common/constants'
import { inBlocksDate } from '@/common/model/inBlocksDate'
import { Address } from '@/common/types'

export interface FundingDetailsStepProps extends Omit<FundingPeriodDetailsContext, keyof GeneralParametersContext> {
  setFundingMaximalRange: (fundingMaximalRange: BN) => void
  setFundingMinimalRange: (fundingMinimalRange: BN) => void
  setCherry: (cherry: BN) => void
  setFundingPeriodLength: (fundingPeriodLength: BN) => void
  setFundingPeriodType: (fundingPeriodType: string) => void
  account?: Address
  maxCherryLimit: number
  minCherryLimit: number
}

export const FundingDetailsStep = ({
  fundingMaximalRange,
  fundingMinimalRange,
  cherry,
  fundingPeriodLength,
  fundingPeriodType,
  setCherry,
  setFundingPeriodType,
  setFundingPeriodLength,
  setFundingMinimalRange,
  setFundingMaximalRange,
  maxCherryLimit,
  minCherryLimit,
}: FundingDetailsStepProps) => {
  const switchCheckbox = (isSet: boolean) => {
    if (isSet) {
      return setFundingPeriodType('limited')
    }
    setFundingPeriodType('perpetual')
    setFundingMinimalRange(BN_ZERO)
  }
  const cherryValidation =
    cherry?.toNumber() > maxCherryLimit
      ? 'Cherry is higher than available amount'
      : cherry?.toNumber() < minCherryLimit
      ? 'Cherry is to low'
      : ''

  return (
    <RowGapBlock gap={24}>
      <RowGapBlock gap={8}>
        <h4>Funding Period Details</h4>
      </RowGapBlock>
      <RowGapBlock gap={20}>
        <InputComponent
          id="field-cherry"
          label="Cherry"
          tight
          units="JOY"
          required
          tooltipText="Funding period tooltip"
          message={cherryValidation}
        >
          <InputNumber
            id="field-cherry"
            isTokenValue
            value={cherry?.toString()}
            placeholder="0"
            onChange={(_, value) => setCherry(new BN(value))}
          />
        </InputComponent>
      </RowGapBlock>
      <RowGapBlock gap={20}>
        <InlineToggleWrap>
          <Label>Discussion mode :</Label>
          <ToggleCheckbox
            falseLabel={
              <CheckBoxLabelWrapper>
                Perpetual
                <Tooltip tooltipText="Lorem ipsum...">
                  <TooltipDefault />
                </Tooltip>
              </CheckBoxLabelWrapper>
            }
            trueLabel={
              <CheckBoxLabelWrapper>
                <StyledParagraph>Limited</StyledParagraph>
                <Tooltip tooltipText="Lorem ipsum...">
                  <TooltipDefault />
                </Tooltip>
              </CheckBoxLabelWrapper>
            }
            checked={fundingPeriodType === 'limited'}
            onChange={switchCheckbox}
          />
        </InlineToggleWrap>
      </RowGapBlock>
      {fundingPeriodType === 'limited' && (
        <RowGapBlock gap={20}>
          <InputComponent
            label="Funding period length"
            required
            units="block"
            tight
            id="field-periodLength"
            message={fundingPeriodLength ? `≈ ${inBlocksDate(fundingPeriodLength)}` : ''}
          >
            <InputNumber
              value={fundingPeriodLength?.toString()}
              placeholder="0"
              id="field-periodLength"
              isTokenValue
              onChange={(_, value) => setFundingPeriodLength(new BN(value))}
            />
          </InputComponent>
        </RowGapBlock>
      )}
      <RowGapBlock gap={20}>
        <TextMedium bold>Funding target range *</TextMedium>
        <Subtitle>
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim
          velit mollit. Exercitation veniam consequat sunt nostrud amet.
        </Subtitle>
      </RowGapBlock>
      <ColumnGapBlock gap={20}>
        <InputComponent id="field-minRange" tight units="JOY" required disabled={fundingPeriodType === 'perpetual'}>
          <InputNumber
            isTokenValue
            id="field-minRange"
            disabled={fundingPeriodType === 'perpetual'}
            value={fundingMinimalRange?.toString()}
            placeholder="0"
            onChange={(_, value) => setFundingMinimalRange(new BN(value))}
          />
        </InputComponent>
        <InputComponent id="field-maxRange" tight units="JOY" required>
          <InputNumber
            isTokenValue
            id="field-maxRange"
            value={fundingMaximalRange?.toString()}
            placeholder="0"
            onChange={(_, value) => setFundingMaximalRange(new BN(value))}
          />
        </InputComponent>
      </ColumnGapBlock>
    </RowGapBlock>
  )
}

export const InlineToggleWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;

  ${Label} {
    line-height: 20px;
    margin-bottom: 0;
  }

  ${TooltipContainer} {
    margin-left: 12px;
  }
`
const Subtitle = styled(TextMedium)`
  color: ${Colors.Black[600]};
`

const CheckBoxLabelWrapper = styled.div`
  display: flex;
  column-gap: 4px;
`

const StyledParagraph = styled.p`
  margin-left: 5px;
`