import React, { useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
// import CountyMap from 'components/CountyMap/CountyMap';
import Outcomes from './Outcomes/Outcomes';
import ShareModelBlock from './ShareModelBlock/ShareModelBlock';
import CallToAction from './CallToAction/CallToAction';
import Header from 'components/Header/Header';
import Chart from 'components/Chart/Chart';
import Newsletter from 'components/Newsletter/Newsletter';
import CountySelector from 'components/MapSelectors/CountySelector';
import {
  Wrapper,
  Content,
  ChartHeader,
  ModelViewOption,
  ModelViewToggle,
  CountySelectorWrapper,
  NoData,
} from './ModelPage.style';
import {
  STATES,
  STATE_TO_INTERVENTION,
  INTERVENTION_COLOR_MAP,
  INTERVENTIONS,
  SHELTER_IN_PLACE_WORST_CASE_COLOR,
} from 'enums';
import { useModelDatas, Model } from 'utils/model';

const limitedActionColor = INTERVENTION_COLOR_MAP[INTERVENTIONS.LIMITED_ACTION];
const socialDistancingColor =
  INTERVENTION_COLOR_MAP[INTERVENTIONS.SOCIAL_DISTANCING];
const shelterInPlaceColor =
  INTERVENTION_COLOR_MAP[INTERVENTIONS.SHELTER_IN_PLACE];
const lockdownColor = INTERVENTION_COLOR_MAP[INTERVENTIONS.LOCKDOWN];
const shelterInPlaceWorseCaseColor =
  INTERVENTION_COLOR_MAP[INTERVENTIONS.SHELTER_IN_PLACE_WORST_CASE];

function ModelPage() {
  const { id: location, countyId: countyId } = useParams();
  const [countyView, setCountyView] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(null);
  const [redirectTarget, setRedirectTarget] = useState();

  let modelDatas = null;
  let interventions = null;
  const modelDatasMap = useModelDatas(location, selectedCounty);
  console.log('modelDatasMap', modelDatasMap, selectedCounty);

  const locationName = STATES[location];
  const countyName = selectedCounty ? selectedCounty.county : null;

  const intervention = STATE_TO_INTERVENTION[location];
  const showModel =
    !countyView ||
    (countyView && selectedCounty && modelDatas && !modelDatas.error);

  const datasForView = countyView
    ? modelDatasMap.countyDatas
    : modelDatasMap.stateDatas;

  modelDatas = datasForView;

  interventions = null;
  if (modelDatas && !modelDatas.error) {
    interventions = buildInterventionMap(datasForView);
  }

  if (redirectTarget) {
    setRedirectTarget(null);
    return <Redirect push to={redirectTarget} />;
  }

  const HeaderWithProps = (
    <Header
      locationName={locationName}
      countyName={countyName}
      intervention={intervention}
    />
  );

  // No model data
  if (
    (!countyView && !modelDatas) ||
    (countyView && selectedCounty && !modelDatas)
  ) {
    console.log('here');
    return (
      <Header
        locationName={locationName}
        countyName={countyName}
        intervention={intervention}
      />
    );
  }

  return (
    <Wrapper>
      <Header
        locationName={locationName}
        countyName={countyName}
        intervention={intervention}
      />
      <Content>
        <Panel>
          <CountySelectorWrapper>
            <ModelViewToggle>
              <ModelViewOption
                selected={!countyView}
                onClick={() => {
                  setRedirectTarget(`/state/${location}`);
                  setCountyView(false);
                  setSelectedCounty(null);
                }}
              >
                State View
              </ModelViewOption>
              <ModelViewOption
                selected={countyView}
                onClick={() => {
                  setCountyView(true);
                }}
              >
                County View
              </ModelViewOption>
            </ModelViewToggle>
            {countyView && (
              <CountySelector
                state={location}
                selectedCounty={selectedCounty}
                handleChange={option => {
                  setRedirectTarget(
                    `/state/${location}/county/${option.county}`,
                  );
                  setSelectedCounty(option);
                }}
                autoFocus
              />
            )}
          </CountySelectorWrapper>
        </Panel>
      </Content>
      {countyName && modelDatas && modelDatas.error && (
        <Content>
          <NoData>
            No data available for {countyName}, {locationName}
          </NoData>
        </Content>
      )}
      {showModel && interventions && (
        <Panel>
          <Chart
            state={locationName}
            county={selectedCounty}
            subtitle="Hospitalizations over time"
            interventions={interventions}
            currentIntervention={intervention}
            dateOverwhelmed={interventions.baseline.dateOverwhelmed}
          />

          <Content>
            <CallToAction
              currentIntervention={intervention}
              interventions={interventions}
            />

            <ShareModelBlock location={location} />

            <Outcomes
              title="Predicted Outcomes after 3 Months"
              models={[
                interventions.baseline,
                interventions.distancingPoorEnforcement.now,
                interventions.distancing.now,
                interventions.contain.now,
              ]}
              colors={[
                limitedActionColor,
                intervention === INTERVENTIONS.SHELTER_IN_PLACE
                  ? shelterInPlaceWorseCaseColor
                  : socialDistancingColor,
                shelterInPlaceColor,
                lockdownColor,
              ]}
              asterisk={['', '*', '*', '**']}
              timeHorizon={100}
              currentIntervention={intervention}
            />

            <ul style={{ textAlign: 'left', lineHeight: '2em' }}>
              <li style={{ listStyleType: 'none', marginBottom: 10 }}>
                *{' '}
                <b>
                  A second spike in disease may occur after social distancing is
                  stopped.
                </b>{' '}
                Interventions are important because they buy time to create
                surge capacity in hospitals and develop therapeutic drugs that
                may have potential to lower hospitalization and fatality rates
                from COVID-19.{' '}
                <a href="https://docs.google.com/document/d/1ETeXAfYOvArfLvlxExE0_xrO5M4ITC0_Am38CRusCko/edit#heading=h.vyhw42b7pgoj">
                  See full scenario definitions here.
                </a>
              </li>
              <li style={{ listStyleType: 'none' }}>
                ** Our models show that it would take at least 2 months of
                Wuhan-style Lockdown to achieve full containment. However, it is
                unclear at this time how you could manage newly introduced
                infections.{' '}
                <a href="https://docs.google.com/document/d/1ETeXAfYOvArfLvlxExE0_xrO5M4ITC0_Am38CRusCko/edit#heading=h.vyhw42b7pgoj">
                  See full scenario definitions here.
                </a>
              </li>
            </ul>
          </Content>
        </Panel>
      )}
      <Content>
        <div style={{ marginTop: '3rem' }}>
          <Newsletter />
        </div>
      </Content>
    </Wrapper>
  );
}

const buildInterventionMap = modelDatas => {
  let interventions = {
    baseline: null,
    distancing: null,
    distancingPoorEnforcement: null,
    contain: null,
  };

  if (!modelDatas) {
    return interventions;
  }

  // Initialize models
  interventions.baseline = new Model(modelDatas.baseline, {
    intervention: INTERVENTIONS.LIMITED_ACTION,
    r0: 2.4,
  });
  interventions.distancing = {
    now: new Model(modelDatas.strictDistancingNow, {
      intervention: INTERVENTIONS.SHELTER_IN_PLACE,
      durationDays: 90,
      r0: 1.2,
    }),
  };
  interventions.distancingPoorEnforcement = {
    now: new Model(modelDatas.weakDistancingNow, {
      intervention: INTERVENTIONS.SOCIAL_DISTANCING,
      durationDays: 90,
      r0: 1.7,
    }),
  };
  interventions.contain = {
    now: new Model(modelDatas.containNow, {
      intervention: INTERVENTIONS.LOCKDOWN,
      durationDays: 90,
      r0: 0.3,
    }),
  };

  return interventions;
};

const Panel = ({ children, title }) => {
  return <div style={{}}>{children}</div>;
};

export default ModelPage;
