export const listOfDealStatus = [
  'dealStartDate',
  'proposalDate',
  'loiExecuteDate',
  'leaseSignedDate',
  'noticeToProceedDate',
  'commercialOperationDate',
  'finalCommissionDate',
];

export const listOfMilestones = [
  'Deal Start',
  'Proposal',
  'LOI Execution',
  'Lease Signed',
  'Notice To Proceed',
  'Commercial Operation',
  'Final Commission',
];

export const mailTemplates = {
  deals: {
    new: './new-deal',
    update: './update-deal',
  }
}

export const mailSubject = {
  deals: {
    started: 'New Tandem Solar Deal Has Been Created',
    updated: 'Tandem Solar New Milestone Achieved!',
    completed: 'Tandem Solar New Milestone Achieved!',
  }
}
