import {
  getFailedLessonIdsFromLatestRenderReport,
  runBatchRender,
} from "./render-all";
import { parseBatchArgs } from "./batch-utils";

const main = async () => {
  const args = parseBatchArgs();
  const reportPath = args.values.get("--report");
  const { lessonIds, reportPath: resolvedReportPath } =
    await getFailedLessonIdsFromLatestRenderReport(reportPath);

  if (lessonIds.length === 0) {
    console.log(`没有可重试的失败 lesson：${resolvedReportPath}`);
    return 0;
  }

  console.log(`准备重试失败 lesson：${lessonIds.join(", ")}`);
  console.log(`来源报告：${resolvedReportPath}`);
  return runBatchRender({ retryLessonIds: lessonIds, sourceReportPath: resolvedReportPath });
};

void main().then((exitCode) => {
  process.exitCode = exitCode;
}).catch((error) => {
  console.error(`失败重试异常：${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
