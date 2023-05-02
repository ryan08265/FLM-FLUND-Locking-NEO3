/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppSettings } from "./../../config/app-settings.js";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "datatables.net-fixedcolumns-bs5/css/fixedColumns.bootstrap5.min.css";
import "datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css";
import QGApi from "../../api-clients/QuizGameApi.js";
import BarsScale from "../../components/loading/BarsScale.jsx";
import clsx from "clsx";
import { ProgressState } from "../../components/progress-state/ProgressState.jsx";

function NormalAnalytics() {
  const context = useContext(AppSettings);
  const { classId } = useParams();

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState();
  const [responses, setResponses] = useState();
  const [showResult, setShowResult] = useState(true);
  const [showCheck, setShowCheck] = useState(true);
  const [questionLevel, setQuestionLevel] = useState(0);
  const [curQuestion, setCurQuestion] = useState();
  const [curQuestionNum, setCurQuestionNum] = useState(0);

  useEffect(() => {
    setLoading(true);

    QGApi.getStudentResponses({ class_id: classId })
      .then((res) => {
        setQuestions(res.data.questions);
        setResponses(res.data.response);
        setCurQuestion(res.data.questions[0]);
        setCurQuestionNum(0);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    context.setAppHeaderNone(true);
    context.setAppSidebarNone(true);
    context.setAppContentFullHeight(true);
    context.setAppContentClass("p-1 ps-xl-4 pe-xl-4 pt-xl-3 pb-xl-3");

    return function cleanUp() {
      context.setAppHeaderNone(false);
      context.setAppSidebarNone(false);
      context.setAppContentFullHeight(false);
      context.setAppContentClass("");
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (questions !== undefined) setCurQuestion(questions[curQuestionNum]);
  }, [curQuestionNum]);

  const answerToString = (answer, ans_id) => {
    if (answer === null) {
      return null;
    }

    switch (questions[ans_id].type) {
      case 0:
        return answer === true ? "true" : "false";
      case 1:
      case 2:
        return answer;
      default:
        return answer.substring(0, 30) + (answer.length > 30 ? "..." : "");
    }
  };

  const getAnswerPercent = (checkVal) => {
    let correctN = 0;
    responses.forEach((resp) => {
      correctN += resp.answer[curQuestionNum].answer === checkVal ? 1 : 0;
    });
    return Math.round((correctN / responses.length) * 100);
  };

  return (
    <>
      {loading ? (
        <div className="h-100 justify-content-center d-flex align-items-center">
          <BarsScale />
        </div>
      ) : (
        <div>
          <div className="mb-3">
            <Link className="icon" to="/analytics/normalQuiz">
              <i className="fas fa-lg fa-fw me-2 fa-sign-out-alt"></i> Return
            </Link>
          </div>

          <div className="mb-3">
            <div className="analysis-toolbar">
              <div className="analysis-control-box">
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`showResultSwitch`}
                    checked={showResult}
                    onChange={(e) => setShowResult(e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`showResultSwitch`}
                  >
                    Show Result
                  </label>
                </div>

                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`checkAnswerSwitch`}
                    checked={showCheck}
                    onChange={(e) => setShowCheck(e.target.checked)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`checkAnswerSwitch`}
                  >
                    Check Answer
                  </label>
                </div>

                <div className="d-flex">
                  <select
                    className="form-select form-select-xs bg-white bg-opacity-5"
                    id="questionLevel"
                    value={questionLevel}
                    onChange={(e) => setQuestionLevel(Number(e.target.value))}
                  >
                    <option value={0}>All</option>
                    <option value={1}>Level 1</option>
                    <option value={2}>Level 2</option>
                    <option value={3}>Level 3</option>
                  </select>
                </div>
              </div>

              <div>
                <span
                  className="badge me-2"
                  style={{ background: "#3af3bc3d" }}
                >
                  Correct
                </span>
                <span
                  className="badge me-2"
                  style={{ background: "#f136363d" }}
                >
                  Wrong
                </span>
                <span className="badge" style={{ background: "#f3e73756" }}>
                  Not Perfect
                </span>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-xs w-100 fw-bold text-nowrap mb-3">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  {questions?.map((question, q_id) => {
                    if (
                      question.level === questionLevel ||
                      questionLevel === 0
                    ) {
                      return (
                        <th
                        className="anlyticsTableHeadCell"
                          key={`question${q_id}`}
                          onClick={() => setCurQuestionNum(q_id)}
                          style={{ cursor: "pointer" }}
                        >
                          {q_id + 1}
                        </th>
                      );
                    }
                  })}
                </tr>
              </thead>
              <tbody className="text-white">
                {responses?.map((resp, st_id) => {
                  return (
                    <tr key={`response${st_id}`}>
                      <td>{st_id + 1}</td>
                      <td>{resp.name}</td>
                      {resp.answer.map((ans, ans_id) => {
                        if (
                          questions[ans_id].level === questionLevel ||
                          questionLevel === 0
                        ) {
                          return (
                            <td
                              key={`answer${ans_id}`}
                              className={clsx({
                                wrong_answer:
                                  ans.correctPercent === 0 && showCheck,
                                correct_answer:
                                  ans.correctPercent === 100 && showCheck,
                                not_perfect_answer:
                                  ans.correctPercent > 0 &&
                                  ans.correctPercent < 100 &&
                                  showCheck,
                              })}
                            >
                              {showResult && answerToString(ans.answer, ans_id)}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <hr className="my-4" />

          {curQuestion && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-1">
                  <div
                    onClick={() => {
                      if (curQuestionNum > 1) {
                        setCurQuestionNum(curQuestionNum - 1);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fas fa-lg fa-fw fa-caret-left"></i>
                  </div>
                  <div>{curQuestionNum + 1}</div>
                  <div
                    onClick={() => {
                      if (curQuestionNum < questions.length - 1) {
                        setCurQuestionNum(curQuestionNum + 1);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fas fa-lg fa-fw fa-caret-right"></i>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <span
                      className={clsx({
                        badge: true,
                        "bg-primary": curQuestion.level === 1,
                        "bg-secondary": curQuestion.level === 2,
                        "bg-dark": curQuestion.level === 3,
                      })}
                    >
                      {`Level ${curQuestion.level}`}
                    </span>
                  </div>
                  <div>id: {curQuestion.id}</div>
                </div>
              </div>

              <div>
                <div className="mb-3">{curQuestion.question}</div>

                {curQuestion.type === 0 && (
                  <div
                    className="d-flex flex-column gap-1"
                    style={{ maxWidth: "500px" }}
                  >
                    <ProgressState
                      correct={curQuestion.answer === true}
                      percent={getAnswerPercent(true)}
                    >
                      true
                    </ProgressState>
                    <ProgressState
                      correct={curQuestion.answer === false}
                      percent={getAnswerPercent(false)}
                    >
                      false
                    </ProgressState>
                  </div>
                )}
                {curQuestion.type === 1 && (
                  <div
                    className="d-flex flex-column gap-1"
                    style={{ maxWidth: "500px" }}
                  >
                    {curQuestion.subQuestions.map((subQuestion, index) => (
                      <ProgressState
                        correct={
                          String.fromCharCode(65 + index) === curQuestion.answer
                        }
                        key={`subQuestion${index}`}
                        percent={getAnswerPercent(
                          String.fromCharCode(65 + index)
                        )}
                      >
                        {String.fromCharCode(65 + index)}. {subQuestion}
                      </ProgressState>
                    ))}
                  </div>
                )}
                {curQuestion.type === 2 && (
                  <div>
                    {curQuestion.answer.map((ans, ans_id) => (
                      <span key={ans_id}>{ans}&nbsp;</span>
                    ))}
                  </div>
                )}
                {curQuestion.type === 3 && (
                  <div>{questions[curQuestionNum].answer}</div>
                )}
              </div>

              <hr className="my-4" />

              <div>
                <table
                  className="table table-hover table-bordered"
                  style={{ width: "auto" }}
                >
                  <thead>
                    <tr>
                      <th style={{ backgroundColor: "rgba(29, 40, 53, 0.95)" }}>
                        Name
                      </th>
                      <th>Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((resp, index) => (
                      <tr key={index}>
                        <th
                          style={{ backgroundColor: "rgba(29, 40, 53, 0.95)" }}
                        >
                          {resp.name}
                        </th>
                        <th>
                          {curQuestion.type === 0
                            ? resp.answer[curQuestionNum].answer === true
                              ? "true"
                              : "false"
                            : resp.answer[curQuestionNum].answer}
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default NormalAnalytics;
