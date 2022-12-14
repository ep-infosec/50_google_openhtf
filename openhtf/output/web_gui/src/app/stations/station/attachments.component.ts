/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Widget displaying a test run's attachments.
 */

import { Component, Input } from '@angular/core';

import { ConfigService } from '../../core/config.service';
import { Attachment } from '../../shared/models/attachment.model';
import { TestState, TestStatus } from '../../shared/models/test-state.model';
import { getStationBaseUrl, getTestBaseUrl } from '../../shared/util';

@Component({
  selector: 'htf-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent {
  @Input() test: TestState;

  expanded = false;

  constructor(private config: ConfigService) {}

  linkForAttachment(attachment: Attachment) {
    // Case 1: The test is currently running.
    if (this.test.testId !== null && this.test.status === TestStatus.running) {
      const testBaseUrl =
          getTestBaseUrl(this.config.dashboardEnabled, this.test);
      return (
          `${testBaseUrl}/phases/${attachment.phaseDescriptorId}/attachments/` +
          `${attachment.name}`);
    }

    // Case 2: We have a history record pointing to file on disk.
    else if (this.test.fileName !== null) {
      const stationBaseUrl =
          getStationBaseUrl(this.config.dashboardEnabled, this.test.station);
      return (
          `${stationBaseUrl}/history/${this.test.fileName}/attachments/` +
          `${attachment.name}?sha1=${attachment.sha1}`);
    }

    // Case 3: If the test is not running and we do not have a filename then we
    // have no way of accessing attachments.
    return null;
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
