export function stats() {
  const now = Date.now();
  const stats = {
    PID: process.pid,
    'Resources Usage - fsRead':                      process.resourceUsage().fsRead,
    'Resources Usage - fsWrite':                     process.resourceUsage().fsWrite,
    'Resources Usage - involuntaryContextSwitches':  process.resourceUsage().involuntaryContextSwitches,
    'Resources Usage - voluntaryContextSwitches':    process.resourceUsage().voluntaryContextSwitches,
    'Resources Usage - ipcReceived':                 process.resourceUsage().ipcReceived,
    'Resources Usage - ipcSent':                     process.resourceUsage().ipcSent,
    'Resources Usage - majorPageFault':              process.resourceUsage().majorPageFault,
    'Resources Usage - minorPageFault':              process.resourceUsage().minorPageFault,
    'Resources Usage - maxRSS':                      process.resourceUsage().maxRSS,
    'Resources Usage - sharedMemorySize':            process.resourceUsage().sharedMemorySize,
    'Resources Usage - signalsCount':                process.resourceUsage().signalsCount,
    'Resources Usage - swappedOut':                  process.resourceUsage().swappedOut,
    'Resources Usage - systemCPUTime':               process.resourceUsage().systemCPUTime,
    'Resources Usage - unsharedDataSize':            process.resourceUsage().unsharedDataSize,
    'Resources Usage - unsharedStackSize':           process.resourceUsage().unsharedStackSize,
    'Resources Usage - userCPUTime':                 process.resourceUsage().userCPUTime,
    'Memory usage - external':   process.memoryUsage().external,
    'Memory usage - heap total': process.memoryUsage().heapTotal,
    'Memory usage - heap used':  process.memoryUsage().heapUsed,
    'Memory usage - rss':        process.memoryUsage().rss,
    'CPU usage - system':    process.cpuUsage().system,
    'CPU usage - user':      process.cpuUsage().user,
  };
  return stats;
}

export function htmlStats() {
  return `
  ${Object
    .entries(stats())
    .reduce((acc: string[], [k, v]) => [...acc, `<span>${k}: ${v}</span>`], [])
    .join('</div><div>')}
  `
}
