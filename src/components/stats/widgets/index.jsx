import OutlierCenterExplorer from './OutlierCenterExplorer'
import HistogramShapeExplorer from './HistogramShapeExplorer'
import DistributionExplorer from './DistributionExplorer'
import CLTSimulator from './CLTSimulator'
import ConfidenceIntervalSimulator from './ConfidenceIntervalSimulator'
import HypothesisTestVisualizer from './HypothesisTestVisualizer'
import CorrelationRegressionPlayground from './CorrelationRegressionPlayground'
import TestSelectorDecisionTree from './TestSelectorDecisionTree'

export const widgetRegistry = {
  'outlier-center-explorer': OutlierCenterExplorer,
  'outlier-center-explorer:boxplot': (props) => <OutlierCenterExplorer {...props} mode="boxplot" />,
  'histogram-shape-explorer': HistogramShapeExplorer,
  'histogram-shape-explorer:skew': (props) => <HistogramShapeExplorer {...props} mode="skew" />,
  'distribution-explorer': DistributionExplorer,
  'distribution-explorer:normal': (props) => <DistributionExplorer {...props} mode="normal" />,
  'distribution-explorer:binomial': (props) => <DistributionExplorer {...props} mode="binomial" />,
  'distribution-explorer:poisson': (props) => <DistributionExplorer {...props} mode="poisson" />,
  'distribution-explorer:uniform': (props) => <DistributionExplorer {...props} mode="uniform" />,
  'clt-simulator': CLTSimulator,
  'confidence-interval-simulator': ConfidenceIntervalSimulator,
  'confidence-interval-simulator:sample-size': (props) => <ConfidenceIntervalSimulator {...props} mode="sample-size" />,
  'hypothesis-test-visualizer': HypothesisTestVisualizer,
  'hypothesis-test-visualizer:error-regions': (props) => <HypothesisTestVisualizer {...props} mode="error-regions" />,
  'correlation-regression-playground': CorrelationRegressionPlayground,
  'correlation-regression-playground:regression': (props) => <CorrelationRegressionPlayground {...props} mode="regression" />,
  'test-selector-decision-tree': TestSelectorDecisionTree,
}
