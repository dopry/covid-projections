import React from 'react';
import { INTERVENTIONS, INTERVENTION_COLOR_MAP } from 'enums';
import Typography from '@material-ui/core/Typography';
import Callout from 'components/Callout/Callout';
import {
  WarnLimitedAction,
  WarnSocialDistancing,
  CheckShelterInPlace,
} from 'assets/images/capacityIcons';

const DAYS = 1000 * 60 * 60 * 24;
const ONE_HUNDRED_DAYS = 100 * DAYS;

const CallToAction = ({ interventions, currentIntervention }) => {
  const interventionToModel = {
    [INTERVENTIONS.LIMITED_ACTION]: interventions.baseline,
    [INTERVENTIONS.SOCIAL_DISTANCING]:
      interventions.distancingPoorEnforcement.now,
    [INTERVENTIONS.SHELTER_IN_PLACE]: interventions.distancing.now,
  };

  const model = interventionToModel[currentIntervention];

  let actionText, shortActionText, capacityIcon, actionDateRange;
  if (
    !model.dateOverwhelmed ||
    model.dateOverwhelmed - new Date() > ONE_HUNDRED_DAYS
  ) {
    actionText = `${currentIntervention} projected to successfully delay hospital overload by greater than 3 months.`;
    shortActionText = `No overload projected`;
    capacityIcon = <CheckShelterInPlace />;
  } else {
    actionText = `To prevent hospital overload, ${suggestedIntervention()} must be implemented by:`;
    const earlyDate = new Date(model.dateOverwhelmed.getTime() - 14 * DAYS);
    const lateDate = new Date(model.dateOverwhelmed.getTime() - 9 * DAYS);
    actionDateRange = (
      <div style={{ fontWeight: 'bold', marginTop: '1.2rem' }}>
        {formatDate(earlyDate)} to {formatDate(lateDate)}
      </div>
    );
    shortActionText = `Overload projected between ${formatDate(
      earlyDate,
    )} to ${formatDate(lateDate)}`;
    capacityIcon =
      currentIntervention === INTERVENTIONS.LIMITED_ACTION ? (
        <WarnLimitedAction />
      ) : (
        <WarnSocialDistancing />
      );
  }

  const Title = ({ children }) => {
    return (
      <div
        style={{
          background: '#f2f2f2',
          padding: '16px',
          color: '#494949',
          fontWeight: 'bold',
        }}
      >
        {children}
      </div>
    );
  };
  const Content = ({ children }) => {
    return (
      <div
        style={{
          padding: '16px',
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <div
      style={{
        marginTop: '2rem',
        border: '1px solid #d5d5d5',
        borderRadius: '4px',
        borderSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <div
        style={{
          borderRight: `1px solid #d5d5d5`,
          width: '50%',
        }}
      >
        <Title>Hospital capacity</Title>
        <Content>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{capacityIcon}</div>
            <div
              style={{
                paddingLeft: '16px',
                color: '#4d4d4d',
              }}
            >
              {shortActionText}
            </div>
          </div>
        </Content>
      </div>
      <div style={{ width: '50%' }}>
        <Title>Current Intervention style</Title>
        <Content>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                borderRadius: '9999px',
                border: '2px solid #4d4d4d',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: INTERVENTION_COLOR_MAP[currentIntervention],
                  borderRadius: '9999px',
                  border: '4px solid white',
                }}
              >
                &nbsp;
              </div>
            </div>
            <div
              style={{
                paddingLeft: '16px',
                color: '#4d4d4d',
              }}
            >
              {currentIntervention}
            </div>
          </div>
        </Content>
      </div>
    </div>
  );
};

const suggestedIntervention = intervention => {
  switch (intervention) {
    case INTERVENTIONS.LIMITED_ACTION:
      return INTERVENTIONS.SHELTER_IN_PLACE;
    case INTERVENTIONS.SOCIAL_DISTANCING:
      return INTERVENTIONS.SHELTER_IN_PLACE;
    default:
      return 'stricter intervention';
  }
};

const formatDate = date => {
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  const day = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(date);
  return `${month} ${day}`;
};

export default CallToAction;
