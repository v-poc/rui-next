import React from "react";
import { useAppState } from "pressify/client";
import { useThemeContext } from "../../context";
import { Link } from "../Link";
import { Pencil } from "../Icons";

/**
 * Based on https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/theme-default/components/PageEdit.vue
 */
function createEditLink(
  docsRepo: string,
  docsBranch: string,
  docsDir: string,
  path: string
) {
  docsRepo = docsRepo.replace(/\/$/, "");
  docsDir = docsDir.replace(/\/$/, "");
  path = `/${path}`;

  if (docsRepo.includes("bitbucket.org")) {
    return (
      docsRepo +
      `/src` +
      `/${docsBranch}` +
      `${docsDir ? "/" + docsDir : ""}` +
      path +
      `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
    );
  }

  if (docsRepo.includes("gitlab.com")) {
    return (
      docsRepo +
      `/-/edit` +
      `/${docsBranch}` +
      (docsDir ? "/" + docsDir : "") +
      path
    );
  }

  docsRepo = /^[a-z]+:/i.test(docsRepo)
    ? docsRepo
    : `https://github.com/${docsRepo}`;

  return (
    docsRepo +
    "/edit" +
    `/${docsBranch}` +
    `${docsDir ? "/" + docsDir : ""}` +
    path
  );
}

export const UpdateInfo: React.FC = () => {
  const { pagePath, pageData } = useAppState();
  const {
    repo,
    docsRepo = repo,
    docsBranch = "master",
    docsDir = "/",
    editLink = false,
    lastUpdated = false,
  } = useThemeContext();

  const editLinkText =
    typeof editLink === "string" ? editLink : "Edit this page on GitHub";
  const lastUpdatedText =
    typeof lastUpdated === "string" ? lastUpdated : "Last updated";

  const finalEditLink =
    editLink && docsRepo && pageData?.filePath
      ? createEditLink(docsRepo, docsBranch, docsDir, pageData.filePath)
      : "";

  const finalLastUpdated =
    lastUpdated && pageData?.meta?.updatedTime
      ? new Date(pageData.meta.updatedTime).toLocaleString()
      : "";

  if (!pagePath || (!finalEditLink && !finalLastUpdated)) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-x-8 text-sm">
      {finalEditLink && (
        <Link className="flex items-center font-medium" to={finalEditLink}>
          <Pencil className="mr-1" />
          {editLinkText}
        </Link>
      )}
      {finalLastUpdated && (
        <div>
          <span className="mr-1 text-c-text-2">{lastUpdatedText}</span>
          <span className="text-c-text-1">{finalLastUpdated}</span>
        </div>
      )}
    </div>
  );
};
